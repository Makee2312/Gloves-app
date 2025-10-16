import { Legend } from "recharts";

// Custom legend item renderer
export const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: entry.color,
              borderRadius: 8, // 🔹 rounded corners
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
