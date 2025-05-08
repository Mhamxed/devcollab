const Hero = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50-600 to-blue-500 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
          Code Together, Build Together
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-bluefrom-blue-50-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A powerful, collaborative coding platform built for teams. Pair program with anyone, anywhere, anytime.
        </p>
        <div className="mt-8 flex justify-center">
         {!user.username && <div className="rounded-md shadow">
            <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-bluefrom-blue-50-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
              Get Started Free
            </a>
          </div>}
         {!user.username && <div className="ml-3 rounded-md shadow">
            <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-bluefrom-blue-900 md:py-4 md:text-lg md:px-10">
              Live Demo
            </a>
          </div>}
          {user.username && <div className="ml-3 rounded-md shadow">
            <a href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-bluefrom-blue-900 md:py-4 md:text-lg md:px-10">
              Dashboard
            </a>
          </div>}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Hero;