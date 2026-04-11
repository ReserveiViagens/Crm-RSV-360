import { usePMSExcursions } from '@/hooks/use-pms-excursions';

export function PMSExcursionsList() {
  const { data, isLoading, error } = usePMSExcursions();

  if (isLoading) return <div>Loading excursions...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Excursions from PMS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((excursion) => (
          <div key={excursion.id} className="border rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold">{excursion.name}</h3>
            <p className="text-gray-600">{excursion.description}</p>
            <p className="text-green-600 font-bold">R$ {excursion.price}</p>
            <p className="text-sm text-gray-500">{excursion.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}