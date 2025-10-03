// useSettings.js
import { useEffect, useState } from "react";
import { dbContext } from "../db/dbContext";

export function useSettings(defaultValue = {}) {
  const [settings, setSettings] = useState(defaultValue);

  // Load from DB on app start
  useEffect(() => {
    const loadData = async () => {
      const saved = await dbContext.settings.get(1); // always use id=1 for single object
      if (saved?.data) {
        console.log(saved.data);
        setSettings(saved.data);
      }
    };
    loadData();
  }, []);

  // Save to DB whenever settings change
  const saveSettings = async (newData) => {
    // await dbContext.delete();
    // await dbContext.open();
    setSettings(newData);
    await dbContext.settings.put({ id: 1, data: newData });
  };

  return [settings, saveSettings];
}
