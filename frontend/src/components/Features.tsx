import React from 'react';
import { Code, MessageSquare, Monitor, Users } from 'lucide-react';

const features = [
    {
      icon: <Users className="text-blue-800 h-8 w-8" />,
      title: "Real-time Collaboration",
      description: "Code together in real-time with zero latency. See changes as they happen."
    },
    {
      icon: <Code className="text-blue-800 h-8 w-8" />,
      title: "Multi-language Support",
      description: "Support for all major programming languages with syntax highlighting."
    },
    {
      icon: <Monitor className="text-blue-800 h-8 w-8" />,
      title: "Live Preview",
      description: "See your code come to life with our integrated preview environment."
    },
    {
      icon: <MessageSquare className="text-blue-800 h-8 w-8" />,
      title: "Integrated Chat",
      description: "Communicate seamlessly without leaving your coding environment."
    }
  ];

const Features: React.FC = () => {
  return (
    <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to code together
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform is designed to make pair programming seamless and enjoyable.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Features;