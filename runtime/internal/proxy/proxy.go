package proxy

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strconv"
	"strings"
)

// peekedConn wraps a connection with a prepended byte for protocol detection.
type peekedConn struct {
	net.Conn
	peeked *bytes.Reader
}

func (p *peekedConn) Read(b []byte) (n int, err error) {
	if p.peeked != nil && p.peeked.Len() > 0 {
		return p.peeked.Read(b)
	}
	return p.Conn.Read(b)
}

// peekListener wraps a listener to detect TLS (0x16) vs HTTP on first byte.
type peekListener struct {
	net.Listener
	tlsConfig *tls.Config
}

func (p *peekListener) Accept() (net.Conn, error) {
	for {
		conn, err := p.Listener.Accept()
		if err != nil {
			return nil, err
		}
		b := make([]byte, 1)
		if _, err := io.ReadFull(conn, b); err != nil {
			conn.Close()
			// Client closed without sending (e.g. port check) - retry, don't kill server
			continue
		}
		peeked := &peekedConn{Conn: conn, peeked: bytes.NewReader(b)}
		if b[0] == 0x16 { // TLS ClientHello
			tlsConn := tls.Server(peeked, p.tlsConfig)
			if err := tlsConn.Handshake(); err != nil {
				peeked.Close()
				continue
			}
			return tlsConn, nil
		}
		return peeked, nil
	}
}

type Server struct {
	port     int
	state    *State
	stateDir string
	useTLS   bool
	caCert   interface{}
	caKey    interface{}
}

func NewServer(port int) (*Server, error) {
	state, err := NewState(port)
	if err != nil {
		return nil, err
	}
	stateDir, err := StateDirPath(port)
	if err != nil {
		return nil, err
	}
	return &Server{port: port, state: state, stateDir: stateDir}, nil
}

func NewServerTLS(port int) (*Server, error) {
	s, err := NewServer(port)
	if err != nil {
		return nil, err
	}
	stateDir, err := EnsureCerts(port)
	if err != nil {
		return nil, err
	}
	s.stateDir = stateDir
	s.useTLS = true
	caCert, caKey, err := ensureCA(stateDir)
	if err != nil {
		return nil, err
	}
	s.caCert = caCert
	s.caKey = caKey
	return s, nil
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	if idx := strings.Index(host, ":"); idx >= 0 {
		host = host[:idx]
	}
	// myapp.localhost -> myapp
	name := strings.TrimSuffix(host, ".localhost")
	if name == host {
		http.Error(w, "expected Host like myapp.localhost", http.StatusBadRequest)
		return
	}

	_ = s.state.Reload()
	route, ok := s.state.GetRoute(name)
	if !ok {
		http.Error(w, "no route for "+name, http.StatusNotFound)
		return
	}

	target, err := url.Parse("http://127.0.0.1:" + strconv.Itoa(route.Port))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	proxy.ServeHTTP(w, r)
}

func (s *Server) ListenAndServe() error {
	addr := fmt.Sprintf(":%d", s.port)
	if s.useTLS {
		tlsConfig := &tls.Config{
			GetCertificate: func(hello *tls.ClientHelloInfo) (*tls.Certificate, error) {
				host := hello.ServerName
				if host == "" {
					host = "localhost"
				}
				cert, key, err := GetCertForHost(s.stateDir, host, s.caCert.(*x509.Certificate), s.caKey.(*ecdsa.PrivateKey))
				if err != nil {
					return nil, err
				}
				return &tls.Certificate{
					Certificate: [][]byte{cert.Raw},
					PrivateKey:  key,
				}, nil
			},
		}
		ln, err := net.Listen("tcp", addr)
		if err != nil {
			return err
		}
		peekLn := &peekListener{Listener: ln, tlsConfig: tlsConfig}
		server := &http.Server{Handler: s}
		return server.Serve(peekLn)
	}
	return http.ListenAndServe(addr, s)
}
