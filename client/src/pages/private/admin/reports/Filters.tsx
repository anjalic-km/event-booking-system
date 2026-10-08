import { Button, Form, Select, DatePicker } from "antd";
import { Download, FileSpreadsheet, FileText, Filter, RotateCcw } from "lucide-react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface FiltersProps {
  events: any[];
  filters: {
    startDate: string;
    endDate: string;
    eventId: string;
  };
  setFilters: (filters: any) => void;
  onApplyFilters: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  loading: boolean;
}

function ReportsFilters({
  events,
  filters,
  setFilters,
  onApplyFilters,
  onExportExcel,
  onExportPDF,
  onExportCSV,
  loading,
}: FiltersProps) {
  const handleDateChange = (dates: any) => {
    if (dates) {
      setFilters({
        ...filters,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setFilters({
        ...filters,
        startDate: "",
        endDate: "",
      });
    }
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      eventId: "all",
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      {/* Filters Section */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Filter size={16} />
          Filters
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          {/* Date Range */}
          <Form.Item 
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>Date Range</span>} 
            style={{ marginBottom: 0 }}
          >
            <RangePicker
              value={
                filters.startDate && filters.endDate
                  ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                  : null
              }
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              placeholder={["Start Date", "End Date"]}
              style={{ width: '100%', height: '38px' }}
            />
          </Form.Item>

          {/* Event Filter */}
          <Form.Item 
            label={<span style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>Event</span>} 
            style={{ marginBottom: 0 }}
          >
            <Select
              value={filters.eventId}
              onChange={(value) => setFilters({ ...filters, eventId: value })}
              placeholder="Select an event"
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Events</Select.Option>
              {events.map((event: any) => (
                <Select.Option key={event._id} value={event._id}>
                  {event.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              onClick={handleReset}
              icon={<RotateCcw size={14} />}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '38px' }}
            >
              Reset
            </Button>
            <Button 
              type="primary" 
              onClick={onApplyFilters} 
              loading={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '38px' }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Export Reports:
          </span>
          <Button
            size="middle"
            icon={<FileSpreadsheet size={16} />}
            onClick={onExportExcel}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Excel
          </Button>
          <Button
            size="middle"
            icon={<FileText size={16} />}
            onClick={onExportPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            PDF
          </Button>
          <Button
            size="middle"
            icon={<Download size={16} />}
            onClick={onExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportsFilters;