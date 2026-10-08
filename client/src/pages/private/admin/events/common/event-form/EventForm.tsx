import { Form, Steps, message } from "antd";
import General from "./General";
import Media from "./Media";
import Tickets from "./Tickets";
import Venue from "./Venue";
import { useEffect, useRef, useState } from "react";
import {
  uploadMediaFiles,
  createEvent,
  editEvent,
} from "../../../../../../apiservices/eventService";
import { useNavigate, useParams } from "react-router-dom";

export interface EventFormStepProp {
  eventData: any;
  setEventData: any;
  setCurrentStep: any;
  currentStep: number;
  selectedMediaFiles?: any;
  setSelectedMediaFiles?: any;
  existingMediaUrls?: string[];
  setExistingMediaUrls?: any;
  loading?: boolean;
  onFinish?: any;
  type?: "create" | "edit";
}

interface EventFormProps {
  initialData?: any;
  type?: "create" | "edit";
}

function EventForm({ initialData = {}, type = "create" }: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState<any>({});
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<File[]>([]);
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  // Refs to always hold the latest state values — prevents stale closure in onFinish
  const eventDataRef = useRef(eventData);
  const selectedMediaFilesRef = useRef(selectedMediaFiles);
  const existingMediaUrlsRef = useRef(existingMediaUrls);

  useEffect(() => { eventDataRef.current = eventData; }, [eventData]);
  useEffect(() => { selectedMediaFilesRef.current = selectedMediaFiles; }, [selectedMediaFiles]);
  useEffect(() => { existingMediaUrlsRef.current = existingMediaUrls; }, [existingMediaUrls]);

  // Seed form state whenever initialData arrives (edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const { media = [], tickets = [], ...rest } = initialData;
      // Map DB field "tickets" back to "ticketTypes" for the form
      setEventData({ ...rest, ticketTypes: tickets });
      setExistingMediaUrls(media);
    }
  }, [initialData]);

  const onFinish = async () => {
    try {
      setLoading(true);

      // Always read from refs so we get the very latest values regardless of closure
      const latestEventData = eventDataRef.current;
      const latestSelectedFiles = selectedMediaFilesRef.current;
      const latestExistingUrls = existingMediaUrlsRef.current;

      // Step 1: Upload any new files selected in this session
      let newMediaUrls: string[] = [];
      if (latestSelectedFiles.length > 0) {
        const formData = new FormData();
        latestSelectedFiles.forEach((file: File) => {
          formData.append("media", file);
        });
        const uploadResponse = await uploadMediaFiles(formData);
        newMediaUrls = uploadResponse.urls;
      }

      // Step 2: Merge kept existing URLs + newly uploaded URLs
      const allMediaUrls = [...latestExistingUrls, ...newMediaUrls];

      // Step 3: Rename ticketTypes → tickets to match the DB model field name
      const { ticketTypes = [], ...restEventData } = latestEventData;
      const payload = { ...restEventData, tickets: ticketTypes, media: allMediaUrls };

      if (type === "edit") {
        await editEvent(params.id!, payload);
        message.success("Event updated successfully!");
      } else {
        await createEvent(payload);
        message.success("Event created successfully!");
      }

      navigate("/admin/events");
    } catch (error: any) {
      message.error(error.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const commonProps: EventFormStepProp = {
    eventData,
    setEventData,
    currentStep,
    setCurrentStep,
    selectedMediaFiles,
    setSelectedMediaFiles,
    existingMediaUrls,
    setExistingMediaUrls,
    loading,
    onFinish,
    type,
  };

  const stepsData = [
    { title: "General", content: <General {...commonProps} /> },
    { title: "Location & Date", content: <Venue {...commonProps} /> },
    { title: "Media", content: <Media {...commonProps} /> },
    { title: "Tickets", content: <Tickets {...commonProps} /> },
  ];

  return (
    <Form layout="vertical">
      <Steps
        current={currentStep}
        onChange={setCurrentStep}
        items={stepsData.map((step) => ({ title: step.title }))}
      />
      <div className="mt-5">{stepsData[currentStep].content}</div>
    </Form>
  );
}

export default EventForm;