'use client';

import { cn } from '@/lib/utils';
import { AdminDashboard } from '@/ui/views/dashboard-view';
import { parsePath } from './admin-utils';
import { CreatePageView } from './create-page';
import { EditPageView } from './edit-page';
import { ListPageView } from './list-page';
import { NestedListPageView } from './nested-list-page';
import { ShowPageView } from './show-page';

interface DynamicAdminPageProps {
  className?: string;
  params: {
    path?: string[];
  };
}

export function DynamicAdminPage({ params, className }: DynamicAdminPageProps) {
  const path = params?.path || [];
  const { resourceName, viewMode, recordId, nestedInfo } = parsePath(path);

  if (viewMode === 'dashboard') {
    return (
      <div className={cn('p-6', className)}>
        <AdminDashboard />
      </div>
    );
  }

  if (!resourceName) {
    return (
      <div className={cn('p-6', className)}>
        <div className="text-destructive">Invalid resource</div>
      </div>
    );
  }

  if (viewMode === 'nested-list' && nestedInfo) {
    return (
      <div className={cn('p-6', className)}>
        <NestedListPageView
          nestedResourceName={nestedInfo.nestedResourceName}
          parentId={nestedInfo.parentId}
          parentResourceName={resourceName}
        />
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      {viewMode === 'list' && <ListPageView resourceName={resourceName} />}
      {viewMode === 'create' && <CreatePageView resourceName={resourceName} />}
      {viewMode === 'edit' && recordId && (
        <EditPageView recordId={recordId} resourceName={resourceName} />
      )}
      {viewMode === 'show' && recordId && (
        <ShowPageView recordId={recordId} resourceName={resourceName} />
      )}
    </div>
  );
}

export default DynamicAdminPage;
