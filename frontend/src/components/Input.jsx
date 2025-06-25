import React from 'react';

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-5 text-primary" /> {/* uses DaisyUI primary color */}
        </div>
      )}
      <input
        className="input input-bordered w-full pl-10 text-base-content bg-base-100"
        {...props}
      />
    </div>
  );
};

export default Input;
