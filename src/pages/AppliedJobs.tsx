import { useGetApplicationsQuery } from '../store/api/applicationsApi';
import { motion } from 'framer-motion';
import { MapPin, Building, Calendar, Briefcase } from 'lucide-react';
import clsx from 'clsx';

export default function AppliedJobs() {
  const { data: applications, isLoading } = useGetApplicationsQuery();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Briefcase className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-slate-500 mt-1">Track the status of jobs you've applied for</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {applications?.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Briefcase className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No applications yet</h3>
              <p>You haven't applied to any jobs yet. Head over to the jobs page to find opportunities.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications?.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl border border-slate-200 flex-shrink-0">
                      {app.job.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{app.job.position}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building size={14} className="text-slate-400" />
                          <span className="font-medium">{app.job.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          {app.job.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 sm:ml-auto">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
                      app.job.type === 'Full Time' ? "bg-emerald-100 text-emerald-700" :
                      app.job.type === 'Part Time' ? "bg-amber-100 text-amber-700" :
                      app.job.type === 'Contract' ? "bg-blue-100 text-blue-700" :
                      "bg-purple-100 text-purple-700"
                    )}>
                      {app.job.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Under Review
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
