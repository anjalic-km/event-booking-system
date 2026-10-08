import { Button, Input } from "antd";
import type { EventFormStepProp } from "./EventForm";

function Tickets({
  currentStep,
  setCurrentStep,
  eventData,
  setEventData,
  loading,
  onFinish,
}: EventFormStepProp) {
  const onAddTicketType = () => {
    const existingTicketTypes = eventData.ticketTypes || [];
    setEventData({
      ...eventData,
      ticketTypes: [...existingTicketTypes, { name: "", price: 0, limit: 0 }],
    });
  };

  const onTicketTypePropertyValueChange = (
    property: string,
    value: string | number,
    index: number,
  ) => {
    const existingTicketTypes = eventData.ticketTypes || [];
    const updatedTicketTypes = existingTicketTypes.map(
      (ticket: any, i: number) =>
        i === index ? { ...ticket, [property]: value } : ticket,
    );
    setEventData({ ...eventData, ticketTypes: updatedTicketTypes });
  };

  const onTicketTypeDelete = (index: number) => {
    const existingTicketTypes = eventData.ticketTypes || [];
    const updatedTicketTypes = existingTicketTypes.filter(
      (_: any, i: number) => i !== index,
    );
    setEventData({ ...eventData, ticketTypes: updatedTicketTypes });
  };

  return (
    <div className="flex flex-col gap-5">
      <Button onClick={onAddTicketType} className="w-max">
        Add Ticket Type
      </Button>

      {eventData?.ticketTypes?.length > 0 && (
        <div>
          <div className="grid grid-cols-4 mb-2">
            <span className="font-semibold">Name</span>
            <span className="font-semibold">Price ($)</span>
            <span className="font-semibold">Limit</span>
            <span className="font-semibold">Action</span>
          </div>
          <div className="flex flex-col gap-3">
            {eventData.ticketTypes.map((ticketType: any, index: number) => (
              <div className="grid grid-cols-4 gap-5" key={index}>
                <Input
                  placeholder="Name"
                  value={ticketType.name}
                  onChange={(e: any) =>
                    onTicketTypePropertyValueChange("name", e.target.value, index)
                  }
                />
                <Input
                  placeholder="Price"
                  type="number"
                  min={0}
                  value={ticketType.price}
                  onChange={(e: any) =>
                    onTicketTypePropertyValueChange("price", Number(e.target.value), index)
                  }
                />
                <Input
                  placeholder="Limit"
                  type="number"
                  min={1}
                  value={ticketType.limit}
                  onChange={(e: any) =>
                    onTicketTypePropertyValueChange("limit", Number(e.target.value), index)
                  }
                />
                <Button
                  type="link"
                  danger
                  onClick={() => onTicketTypeDelete(index)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-10 justify-between mt-3">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={loading}
        >
          Back
        </Button>
        <Button type="primary" onClick={onFinish} loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Tickets;