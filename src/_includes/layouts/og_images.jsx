/** @jsxImportSource npm:react@18.2.0 */

export default function({ title, description }) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#303846",
        fontSize: 28,
        fontWeight: 400,
        color: "#ffffff",
      }}
    >
      <div style={{ marginTop: 20, fontSize: 40, fontWeight: 700 }}>
        {title}
      </div>
      <svg
        fill="#3578e5"
        height="300"
        width="300"
        id="cloud_og"
        viewBox="0 0 436.127 436.127"
      >
        <path d="M350.359,191.016c-7.814-66.133-64.062-117.431-132.296-117.431S93.581,124.883,85.768,191.016C38.402,191.016,0,229.413,0,276.779c0,47.366,38.397,85.763,85.763,85.763h264.601c47.366,0,85.763-38.397,85.763-85.763C436.127,229.413,397.725,191.016,350.359,191.016z" />
      </svg>
      <div style={{ marginBottom: 20 }}>{description}</div>
    </div>
  );
}
