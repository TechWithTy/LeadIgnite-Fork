import React from 'react';
import Lottie from 'lottie-react';
import { RefreshCw } from 'lucide-react'; // You can also use FontAwesome if needed
import * as OutReachAnimation from '@/public/lottie/CampaignPing.json'; // Path to the Lottie animation

interface NoCampaignsProps {
  totalCampaigns: number; // Number of total campaigns
}

const CampaignsMainContent: React.FC<NoCampaignsProps> = ({
  totalCampaigns
}) => {
  return (
    <div className="h-full w-full rounded-md bg-white dark:bg-gray-900 ">
      {/* Header with Create Campaign button, Last updated, and Export to CSV */}
      <div className="flex items-center justify-between p-4">
        {/* Create Campaign Button */}
        <button className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <i className="fas fa-rocket mr-2"></i>
          Create Campaign
        </button>

        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
          {/* Updated time with refresh button */}
          <div className="flex items-center space-x-2">
            <span>Updated 8 minutes ago</span>
            <button className="rounded-md p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700">
              <RefreshCw
                size={18}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>

          {/* Export to CSV Button */}
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            <i className="fas fa-file-export mr-2"></i>
            Export to CSV
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        {totalCampaigns === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            {/* Lottie Animation */}
            <div className="mb-4 h-48 w-48">
              <Lottie animationData={OutReachAnimation} loop autoplay />
            </div>

            {/* Text and Button */}
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
              Start your first campaign
            </h2>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Click the button below to get started with your first campaign.
            </p>

            {/* Create Campaign Button */}
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <i className="fas fa-rocket mr-2"></i> Create Campaign
            </button>
          </div>
        ) : (
          <div className="p-8">
            {/* Replace this with the actual campaigns list when totalCampaigns > 0 */}
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
              Your campaigns will be listed here.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsMainContent;
