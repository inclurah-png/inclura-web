function StoriesSection() {
  const stories = [
    {
      name: "Create Story",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43",
      create: true,
    },
    {
      name: "Amina",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      name: "David",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
    {
      name: "Grace",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    {
      name: "Tunde",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    },
    {
      name: "Ngozi",
      image:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    },
  ];

  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "20px",
        overflowX: "auto",
        display: "flex",
        gap: "12px",
      }}
    >
      {stories.map((story, index) => (
        <div
          key={index}
          style={{
            minWidth: "110px",
            height: "180px",
            borderRadius: "18px",
            overflow: "hidden",
            position: "relative",
            background: "#1e293b",
            flexShrink: 0,
          }}
        >
          <img
            src={story.image}
            alt={story.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "10px",
              color: "white",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {story.name}
          </div>

          {story.create && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              +
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StoriesSection;
