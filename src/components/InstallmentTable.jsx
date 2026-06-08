import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, isAfter, addDays } from 'date-fns';

const InstallmentTable = ({ installments, onPay }) => {
  const isOverdue = (dueDate) => {
    return isAfter(new Date(), addDays(new Date(dueDate), 7));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {installments.map((inst) => {
            const overdue = !inst.paid_at && isOverdue(inst.due_date);
            return (
              <tr key={inst.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inst.installment_no}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${inst.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(inst.due_date), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {inst.paid_at ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle size={16} className="mr-1" /> Paid
                    </span>
                  ) : overdue ? (
                    <span className="flex items-center text-red-600 text-sm">
                      <AlertCircle size={16} className="mr-1" /> Overdue
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 text-sm">
                      <Clock size={16} className="mr-1" /> Upcoming
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!inst.paid_at && (
                    <button
                      onClick={() => onPay(inst.id)}
                      className="bg-sky-navy text-white px-4 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                  {inst.penalty > 0 && (
                    <p className="text-[10px] text-red-500 font-bold mt-1">Penalty: ${inst.penalty}</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InstallmentTable;
