const DashboardCard = ({ title, value, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition duration-300"
    >
      <div className="flex justify-center mb-2 text-3xl text-blue-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
