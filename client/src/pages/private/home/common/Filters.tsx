import { Button, Form, Input } from "antd";

interface FiltersProps {
  filters: { searchText: string; date: string };
  setFilters: (filters: { searchText: string; date: string }) => void;
  onFilter: (filters: { searchText: string; date: string }) => void;
}

function Filters({ filters, setFilters, onFilter }: FiltersProps) {
  const onClearFilters = () => {
    const emptyFilters = { searchText: "", date: "" };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <Form layout="vertical" className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
      <Form.Item label="Search by Event Name">
        <Input
          placeholder="Search events..."
          value={filters.searchText}
          onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Filter by Date">
        <Input
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          type="date"
        />
      </Form.Item>

      <div className="flex gap-5">
        <Button onClick={onClearFilters}>Clear Filters</Button>
        <Button
          disabled={!filters.searchText && !filters.date}
          type="primary"
          onClick={() => onFilter(filters)}
        >
          Apply Filters
        </Button>
      </div>
    </Form>
  );
}

export default Filters;