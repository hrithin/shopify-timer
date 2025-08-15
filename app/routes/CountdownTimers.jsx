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
  AppProvider,
  Banner
} from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';

const API_BASE_URL = "https://shopify-timer.onrender.com/api/timers";

function CountdownTimers() {
  const [modalActive, setModalActive] = useState(false);
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeDomain, setStoreDomain] = useState("");

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
    // Get store domain from URL
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    if (shop) {
      setStoreDomain(shop);
      fetchTimers(shop);
    }
  }, []);

  const fetchTimers = async (shop) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${shop}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timers');
      }
      
      const data = await response.json();
      setTimers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching timers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTimer = async (timerData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...timerData,
          storeDomain
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create timer');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error creating timer:', err);
      throw err;
    }
  };

  const deleteTimer = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete timer');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error deleting timer:', err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleModal = () => setModalActive(!modalActive);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      const timer = {
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
      
      const newTimer = await createTimer(timer);
      setTimers([...timers, newTimer]);
      
      // Reset form
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTimer(id);
      setTimers(timers.filter(timer => timer._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Countdown Timer Manager">
        <Card sectioned>
          {error && (
            <Banner title="Error" status="critical" onDismiss={() => setError(null)}>
              {error}
            </Banner>
          )}
          
          <Button onClick={toggleModal} primary>
            + Create timer
          </Button>
          
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>Loading timers...</div>
          ) : (
            <ResourceList
              resourceName={{ singular: "timer", plural: "timers" }}
              items={timers}
              renderItem={(item) => (
                <ResourceList.Item
                  id={item._id}
                  accessibilityLabel={`View details for ${item.timerName}`}
                >
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
                    <div style={{ marginTop: 10 }}>
                      <Button destructive onClick={() => handleDelete(item._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </ResourceList.Item>
              )}
              emptyState={<div style={{ padding: 20 }}>No timers created.</div>}
            />
          )}

          <Modal
            open={modalActive}
            onClose={toggleModal}
            title="Create New Timer"
            primaryAction={{ 
              content: "Create timer", 
              onAction: handleCreate,
              loading: loading
            }}
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
                    required
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
                    required
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

export default CountdownTimers;