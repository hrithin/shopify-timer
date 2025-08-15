import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  FormLayout,
  TextField,
  Select,
  ColorPicker,
  Page,
  Card,
  ResourceList,
  AppProvider
} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';

function CountdownTimers() {
  const [isClient, setIsClient] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [timers, setTimers] = useState([
    {
      id: 1,
      timerName: "Summer Sale",
      startTime: "2025-08-15T09:00",
      endTime: "2025-08-20T23:59",
      promotionText: "Up to 50% off on summer collection!",
      displayOptions: {
        color: "hsl(0,100%,50%)",
        size: "large",
        position: "top",
      },
      urgency: {
        enabled: true,
        type: "colorPulse",
      },
    },
    {
      id: 2,
      timerName: "Flash Deal",
      startTime: "2025-08-16T12:00",
      endTime: "2025-08-16T18:00",
      promotionText: "Limited time flash deal!",
      displayOptions: {
        color: "hsl(240,100%,50%)",
        size: "medium",
        position: "bottom",
      },
      urgency: {
        enabled: true,
        type: "notificationBanner",
      },
    },
  ]);

  const [formData, setFormData] = useState({
    timerName: "",
    startDate: "",
    startTime: "00:00",
    endDate: "",
    endTime: "23:59",
    promotionDesc: "",
    color: { hue: 120, brightness: 1, saturation: 1 },
    timerSize: "medium",
    timerPosition: "top",
    urgency: "colorPulse",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString) => {
    if (!isClient) return dateString;
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleModal = () => setModalActive(!modalActive);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = () => {
    const timer = {
      id: Date.now(),
      timerName: formData.timerName,
      startTime: `${formData.startDate}T${formData.startTime}`,
      endTime: `${formData.endDate}T${formData.endTime}`,
      promotionText: formData.promotionDesc,
      displayOptions: {
        color: `hsl(${formData.color.hue},${formData.color.saturation * 100}%,${formData.color.brightness * 100}%)`,
        size: formData.timerSize,
        position: formData.timerPosition,
      },
      urgency: {
        enabled: formData.urgency !== "none",
        type: formData.urgency,
      },
    };
    setTimers([...timers, timer]);
    setFormData({
      timerName: "",
      startDate: "",
      startTime: "00:00",
      endDate: "",
      endTime: "23:59",
      promotionDesc: "",
      color: { hue: 120, brightness: 1, saturation: 1 },
      timerSize: "medium",
      timerPosition: "top",
      urgency: "colorPulse",
    });
    toggleModal();
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Countdown Timer Manager">
        <Card sectioned>
          <Button onClick={toggleModal} primary>
            + Create timer
          </Button>
          <ResourceList
            resourceName={{ singular: "timer", plural: "timers" }}
            items={timers}
            renderItem={(item) => (
              <ResourceList.Item id={item.id}>
                <div>
                  <span style={{ fontWeight: 'bold' }}>{item.timerName}</span>
                  <div>{item.promotionText}</div>
                  <div>
                    {formatDate(item.startTime)} – {formatDate(item.endTime)}
                  </div>
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        marginRight: 5,
                        borderRadius: 3,
                        background: item.displayOptions.color,
                      }}
                    />
                    {item.displayOptions.size}, {item.displayOptions.position},{" "}
                    Urgency: {item.urgency.type}
                  </div>
                </div>
              </ResourceList.Item>
            )}
            emptyState={<div style={{ padding: 20 }}>No timers created.</div>}
          />

          <Modal
            open={modalActive}
            onClose={toggleModal}
            title="Create New Timer"
            primaryAction={{ content: "Create timer", onAction: handleCreate }}
            secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
          >
            <Modal.Section>
              <FormLayout>
                <TextField
                  label="Timer name"
                  value={formData.timerName}
                  onChange={(value) => handleInputChange("timerName", value)}
                  requiredIndicator
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <TextField
                    type="date"
                    label="Start date"
                    value={formData.startDate}
                    onChange={(value) => handleInputChange("startDate", value)}
                  />
                  <TextField
                    type="time"
                    label="Start time"
                    value={formData.startTime}
                    onChange={(value) => handleInputChange("startTime", value)}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <TextField
                    type="date"
                    label="End date"
                    value={formData.endDate}
                    onChange={(value) => handleInputChange("endDate", value)}
                  />
                  <TextField
                    type="time"
                    label="End time"
                    value={formData.endTime}
                    onChange={(value) => handleInputChange("endTime", value)}
                  />
                </div>
                <TextField
                  label="Promotion description"
                  value={formData.promotionDesc}
                  onChange={(value) => handleInputChange("promotionDesc", value)}
                  multiline
                />
                <ColorPicker
                  color={formData.color}
                  onChange={(color) => handleInputChange("color", color)}
                />
                <div style={{ display: "flex", gap: 12 }}>
                  <Select
                    label="Timer size"
                    options={[
                      { label: "Small", value: "small" },
                      { label: "Medium", value: "medium" },
                      { label: "Large", value: "large" },
                    ]}
                    value={formData.timerSize}
                    onChange={(value) => handleInputChange("timerSize", value)}
                  />
                  <Select
                    label="Timer position"
                    options={[
                      { label: "Top", value: "top" },
                      { label: "Bottom", value: "bottom" },
                      { label: "Left", value: "left" },
                      { label: "Right", value: "right" },
                    ]}
                    value={formData.timerPosition}
                    onChange={(value) => handleInputChange("timerPosition", value)}
                  />
                </div>
                <Select
                  label="Urgency notification"
                  options={[
                    { label: "None", value: "none" },
                    { label: "Color pulse", value: "colorPulse" },
                    { label: "Notification banner", value: "notificationBanner" },
                  ]}
                  value={formData.urgency}
                  onChange={(value) => handleInputChange("urgency", value)}
                />
              </FormLayout>
            </Modal.Section>
          </Modal>
        </Card>
      </Page>
    </AppProvider>
  );
}


function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <CountdownTimers />
    </AppProvider>
  );
}

export default App;