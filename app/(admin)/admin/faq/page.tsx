'use client';

import React, { useState } from 'react';
import { 
  useGetAllFaqQuery, 
  useCreateFaqMutation, 
  useUpdateFaqMutation, 
  useDeleteFaqMutation 
} from '@/app/store/api/faqApi';
import { revalidateFaq } from '@/app/actions/revalidate';
import Swal from 'sweetalert2';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { Button } from '@/app/components/ui/button';

export default function FAQManagementPage() {
  const [searchTerm, setSearchTerm] = useState('general');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    question_type: 'general'
  });

  // API Hooks
  const { data: faqData, isLoading, isError } = useGetAllFaqQuery({ 
    searchTerm, 
    page: currentPage, 
    limit 
  });
  
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const handleOpenModal = (faq?: any) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        question_type: faq.question_type || 'general'
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        question_type: 'general'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        await updateFaq({ _id: editingFaq._id, data: formData }).unwrap();
        await revalidateFaq();
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'FAQ has been updated successfully.',
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        });
      } else {
        await createFaq(formData).unwrap();
        await revalidateFaq();
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New FAQ has been added.',
          background: '#171717',
          color: '#fff',
          confirmButtonColor: '#D4A574'
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.message || 'Something went wrong!',
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#D4A574'
      });
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#171717',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFaq(id).unwrap();
          await revalidateFaq();
          Swal.fire({
            title: 'Deleted!',
            text: 'FAQ has been deleted.',
            icon: 'success',
            background: '#171717',
            color: '#fff',
            confirmButtonColor: '#D4A574'
          });
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error?.data?.message || 'Failed to delete FAQ.',
            background: '#171717',
            color: '#fff',
            confirmButtonColor: '#D4A574'
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-montserrat">FAQ Management</h1>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90 font-montserrat"
        >
          <FiPlus className="mr-2" /> Add FAQ
        </Button>
      </div>

      {/* Search Bar (Optional, since we filter by 'general' by default) */}
      {/* <div className="mb-6 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#171717] border border-gray-700 rounded-lg text-white focus:ring-[#D4A574] focus:border-[#D4A574] font-montserrat"
        />
      </div> */}

      {/* FAQ List */}
      <div className="bg-[#171717] rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading FAQs...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Failed to load FAQs.</div>
        ) : faqData?.data?.allFaqList?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No FAQs found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-[#272727]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-montserrat">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-montserrat">
                  Answer
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider font-montserrat">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {faqData?.data?.allFaqList?.map((faq: any) => (
                <tr key={faq._id} className="hover:bg-[#222]">
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-200 font-montserrat">
                    {faq.question}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-400 font-montserrat">
                    {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleOpenModal(faq)}
                      className="text-[#D4A574] hover:text-[#c4925e] mr-4"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination (Simple Implementation) */}
         {faqData?.data?.meta?.totalPage > 1 && (
            <div className="px-6 py-4 flex justify-end gap-2 border-t border-gray-800">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1 bg-[#272727] text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-400 self-center">
                    Page {currentPage} of {faqData?.data?.meta?.totalPage}
                </span>
                <button 
                    disabled={currentPage === faqData?.data?.meta?.totalPage}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1 bg-[#272727] text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
         )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#171717] rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6 font-montserrat">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-montserrat">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-4 py-2 bg-[#272727] border border-gray-700 rounded-lg text-white focus:ring-[#D4A574] focus:border-[#D4A574] font-montserrat"
                  placeholder="e.g., Return Policy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-montserrat">
                  Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full px-4 py-2 bg-[#272727] border border-gray-700 rounded-lg text-white focus:ring-[#D4A574] focus:border-[#D4A574] font-montserrat"
                  placeholder="Enter the answer here..."
                />
              </div>

               {/* Hidden Type Input - Defaults to 'general' */}
               <input type="hidden" value={formData.question_type} />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium font-montserrat"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90 font-montserrat"
                >
                  {isCreating || isUpdating ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Create FAQ')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}