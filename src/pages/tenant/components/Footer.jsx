export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="px-4 py-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DigiPlot. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};