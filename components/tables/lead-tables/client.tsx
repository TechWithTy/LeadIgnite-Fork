'use client';
import React, { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LeadStatus } from '@/constants/data';
import { Plus, Filter, Calendar, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Input } from '@/components/ui/input';
import AddLeadModal from '@/components/reusables/modals/leadModal';
import Lottie from 'lottie-react';
import searchAnimation from '@/public/lottie/SearchPing.json'; // Lottie JSON file path
import FilterDropdown from './utils/filterLeads';
import { LeadDataTable } from './lead-data-table';
import { useLeadStore } from '@/lib/stores/lead';
import { formatISO, startOfToday, endOfToday } from 'date-fns'; // Ensure you import these utilities

export const LeadClient: React.FC = () => {
  const router = useRouter();

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter dropdown visibility
  const [searchKey, setSearchKey] = useState(''); // Local state to manage search key

  // Zustand store states and actions
  const allLeads = useLeadStore((state) => state.leads);
  const leads = useLeadStore((state) => state.filteredLeads);
  const filterByStatus = useLeadStore((state) => state.filterByStatus);
  const filterByFollowUp = useLeadStore((state) => state.filterByFollowUp);
  const filterByCampaignID = useLeadStore((state) => state.filterByCampaignID);
  const resetFilters = useLeadStore((state) => state.resetFilters);

  // Filter state
  const [selectedCampaign, setSelectedCampaign] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>();

  const filterDropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  const applyFilter = () => {
    if (selectedStatus) {
      filterByStatus(selectedStatus);
    }

    if (selectedCampaign) {
      filterByCampaignID(selectedCampaign);
    }

    console.log('Applying Filter:', { selectedCampaign, selectedStatus });
    setIsFilterOpen(false); // Close the dropdown after applying the filter
  };

  const closeFilterDropdown = () => {
    setIsFilterOpen(false);
  };

  const resetFilter = () => {
    setSelectedCampaign(undefined);
    setSelectedStatus(undefined);
    resetFilters(); // Reset all the filters using the Zustand store
  };

  const filterByTodayFollowUps = () => {
    const todayStart = formatISO(startOfToday());
    const todayEnd = formatISO(endOfToday());
    filterByFollowUp(todayStart, todayEnd); // Trigger filtering by today's follow-ups
  };

  // Memoize the unique campaign IDs from filtered leads
  const availableCampaigns = useMemo(() => {
    const campaignIds = allLeads
      .map((lead) => lead.campaignID) // Extract campaign IDs
      .filter((campaignID): campaignID is string => !!campaignID); // Filter out undefined/null and cast to string
    return Array.from(new Set(campaignIds)); // Return only unique campaign IDs
  }, [leads]);

  return (
    <>
      <div className="flex items-start justify-between">
        {/* Heading Component */}
        <Heading
          title={`Lead Manager (${leads.length})`}
          description="See a list of existing leads and follow ups, or create new leads."
        />

        {/* Right-aligned buttons */}
        <div className="flex flex-col space-y-2">
          {/* Create Lead Button */}
          <Button
            onClick={openModal}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            <Plus className="mr-2" /> Create Lead
          </Button>

          <div className="flex space-x-2">
            {/* Today's Follow Ups Button */}
            <Button
              variant="outline"
              className="overflow-hidden truncate whitespace-nowrap border-blue-600 text-blue-600"
              onClick={filterByTodayFollowUps} // Trigger the filter for today's follow-ups
            >
              <Calendar className="mr-2" />
              Today&apos;s Follow Ups
            </Button>

            {/* Filter Button with Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
              <FilterDropdown
                selectedCampaign={selectedCampaign}
                setSelectedCampaign={setSelectedCampaign}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                resetFilter={resetFilter}
                applyFilter={applyFilter}
                availableCampaigns={availableCampaigns} // Pass available campaign IDs to the dropdown
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Lead Data Table */}
      {leads.length > 0 ? (
        <LeadDataTable
          pageCount={10}
          searchKey="Leads"
          columns={columns}
          data={leads}
        />
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <Lottie animationData={searchAnimation} loop autoplay />
          <h2 className="mt-6 text-xl font-semibold">Create New Lead</h2>
          <p className="mt-2 text-gray-500">
            Click the button below to get started.
          </p>
          <Button
            onClick={openModal}
            className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            <Plus className="mr-2" /> Create Lead
          </Button>
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default LeadClient;
