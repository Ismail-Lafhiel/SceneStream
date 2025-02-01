import { motion } from "framer-motion";

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-gray-800 hover:bg-gray-800/80 transition-all duration-300"
            >
              <div className="text-blue-600 text-4xl mb-4">
                <i className={feature.icon}></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
