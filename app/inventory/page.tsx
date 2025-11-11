const InventoryPage = () => {
  return (
    <div>
      <p>
        This is the main content area. Content will change based on the selected
        page.
      </p>

      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="mb-4 p-4 border border-[#f0f0f0] rounded">
          <p>Content item {i + 1}</p>
        </div>
      ))}
    </div>
  );
};

export default InventoryPage;
