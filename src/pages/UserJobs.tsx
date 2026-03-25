import { useState } from 'react';
import { useGetJobsQuery } from '../store/api/jobsApi';
import { useGetApplicationsQuery, useApplyToJobMutation } from '../store/api/applicationsApi';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Building, Filter, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function UserJobs() {
  const [filters, setFilters] = useState({
    companyName: '',
    location: '',
    type: ''
  });
  
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const { data: jobs, isLoading } = useGetJobsQuery(debouncedFilters);
  const { data: applications } = useGetApplicationsQuery();
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    // Simple debounce
    setTimeout(() => setDebouncedFilters(newFilters), 300);
  };

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId).unwrap();
      alert('Applied successfully!');
    } catch (error: any) {
      alert(error.data?.message || 'Failed to apply');
    }
  };

  const hasApplied = (jobId: string) => {
    return applications?.some(app => app.job._id === jobId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">dream job</span>
        </h1>
        <p className="text-lg text-slate-600">
          Discover thousands of job opportunities with all the information you need.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            name="companyName"
            placeholder="Search by company..."
            value={filters.companyName}
            onChange={handleFilterChange}
            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex-1 relative md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-200 group-hover:scale-110 transition-transform">
                  {job.companyName.charAt(0)}
                </div>
                <span className={clsx(
                  "px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
                  job.type === 'Full Time' ? "bg-emerald-100 text-emerald-700" :
                  job.type === 'Part Time' ? "bg-amber-100 text-amber-700" :
                  job.type === 'Contract' ? "bg-blue-100 text-blue-700" :
                  "bg-purple-100 text-purple-700"
                )}>
                  {job.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{job.position}</h3>
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <Building size={16} className="text-slate-400" />
                <span className="font-medium">{job.companyName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 mt-auto">
                <MapPin size={16} className="text-slate-400" />
                {job.location}
              </div>
              
              <button
                onClick={() => handleApply(job._id)}
                disabled={hasApplied(job._id) || isApplying}
                className={clsx(
                  "w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                  hasApplied(job._id) 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-indigo-600 shadow-sm hover:shadow"
                )}
              >
                {hasApplied(job._id) ? (
                  <>
                    <CheckCircle size={18} />
                    Applied
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </motion.div>
          ))}
          {jobs?.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No jobs found</h3>
              <p>Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
