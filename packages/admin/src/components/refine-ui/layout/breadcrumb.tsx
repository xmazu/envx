'use client';

import { useBreadcrumb, useLink } from '@refinedev/core';
import { Home } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumb() {
  const Link = useLink();
  const { breadcrumbs } = useBreadcrumb();

  const breadCrumbItems = useMemo(() => {
    const list: {
      key: string;
      href: string;
      Component: React.ReactNode;
    }[] = [];

    list.push({
      key: 'breadcrumb-item-home',
      href: '/',
      Component: (
        <Link to="/">
          <Home className="oa-:h-4 oa-:w-4" />
        </Link>
      ),
    });

    for (const { label, href } of breadcrumbs) {
      list.push({
        key: `breadcrumb-item-${label}`,
        href: href ?? '',
        Component: href ? <Link to={href}>{label}</Link> : <span>{label}</span>,
      });
    }

    return list;
  }, [breadcrumbs, Link]);

  return (
    <ShadcnBreadcrumb>
      <ShadcnBreadcrumbList>
        {breadCrumbItems.map((item, index) => {
          if (index === breadCrumbItems.length - 1) {
            return (
              <ShadcnBreadcrumbPage key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbPage>
            );
          }

          return (
            <Fragment key={item.key}>
              <ShadcnBreadcrumbItem key={item.key}>
                {item.Component}
              </ShadcnBreadcrumbItem>
              <ShadcnBreadcrumbSeparator />
            </Fragment>
          );
        })}
      </ShadcnBreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

Breadcrumb.displayName = 'Breadcrumb';
