function WelcomeContent() {
  return (
    <div className="h-screen flex items-center justify-center bg-primary w-full">
      <div className="flex flex-col gap-2">
        <img src="./events.jpg" alt="logo" className="w-64 h-56"/>
        <h1 className="text-orange-500 text-6xl font-bold">EMS</h1>
        <p className="text-blue-600 text-sm">Welcome To EMS, Manage Events</p>
      </div>
    </div>
  );
}

export default WelcomeContent;
