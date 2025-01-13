
import { Input } from '@/components/ui/input'
import React from 'react'

const SearchBar = ({searchTerm,setSearchTerm}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
    <Input
      type="text"
      placeholder="Search by filename"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border rounded p-2 w-40"
    />
  </div>
  )
}

export default SearchBar
