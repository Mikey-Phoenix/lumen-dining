export default function Map() {

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg">
      <iframe
        title="Restaurant Location"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src="https://maps.google.com/maps?q=1654+Columbia+Rd,+Washington,+DC+20009&output=embed"
      />
    </div>
  );
}