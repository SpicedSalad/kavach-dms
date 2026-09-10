import { Button } from './Button';

export function EmptyState({ title, description, actionText, onAction, icon: Icon }) {
  return (
    <div className="text-center py-12 px-4 border border-gray-200 rounded-sm bg-gray-50">
      {Icon && <Icon className="mx-auto h-8 w-8 text-gray-400 mb-4" />}
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      {actionText && (
        <div className="mt-6">
          <Button variant="secondary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
