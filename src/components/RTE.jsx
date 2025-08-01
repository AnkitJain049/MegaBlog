import React from "react";
import { Controller } from "react-hook-form";

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1 text-gray-700 font-medium">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <textarea
            value={value || defaultValue}
            onChange={onChange}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            placeholder="Write your content here..."
            style={{ minHeight: '256px', maxHeight: '400px' }}
          />
        )}
      />
    </div>
  );
}
