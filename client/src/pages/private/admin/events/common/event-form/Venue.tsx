import { Button, Form, Input } from "antd";
import type { EventFormStepProp } from "./EventForm";

function Venue({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
}: EventFormStepProp) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Form.Item label="Address" required>
        <Input
          placeholder="Address"
          value={eventData.address}
          onChange={(e) =>
            setEventData({ ...eventData, address: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="City" required>
        <Input
          placeholder="City"
          value={eventData.city}
          onChange={(e) => setEventData({ ...eventData, city: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Date" required>
        <Input
          placeholder="Date"
          value={eventData.date}
          type="date"
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
        />
      </Form.Item>
      <Form.Item label="Time" required>
        <Input
          placeholder="Time"
          value={eventData.time}
          type="time"
          onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
        />
      </Form.Item>
      <div className="flex gap-10 justify-between col-span-2">
        <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
        <Button
          type="primary"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={
            !eventData.address ||
            !eventData.city ||
            !eventData.date ||
            !eventData.time
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Venue;
