const PageTemplate = ({ title, description, testId }) => {
  return (
    <div className="space-y-6" data-testid={testId}>
      <div>
        <h1 className="text-3xl font-heading font-semibold tracking-tight text-neutral-900">{title}</h1>
        <p className="text-neutral-600 mt-1">{description}</p>
      </div>
      <div className="bg-white border border-neutral-200 rounded-lg p-8">
        <div className="text-center text-neutral-500">
          <p className="text-lg">This page is under development</p>
          <p className="text-sm mt-2">Full CRUD functionality will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;
