const Features = () => {
  const features = [
    {
      icon: "fas fa-tv",
      title: "Watch Everywhere",
      description: "Stream on your phone, tablet, laptop, and TV.",
    },
    {
      icon: "fas fa-film",
      title: "Unlimited Content",
      description: "Enjoy a wide variety of movies and TV shows.",
    },
    {
      icon: "fas fa-times-circle",
      title: "Cancel Anytime",
      description: "No complicated contracts. No commitments.",
    },
  ];

  return (
    <div className="bg-gray-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-blue-500 text-4xl mb-4">
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
