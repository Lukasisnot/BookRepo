// Custom theme for TextInput
export const customInputTheme = {
  field: {
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-5 w-5 text-slate-400", // Icon color for dark theme
    },
    input: {
      base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
      sizes: {
        sm: "p-2 sm:text-xs",
        md: "p-2.5 text-sm",
        lg: "p-4 sm:text-base",
      },
      colors: {
        // Override 'gray' color for our dark theme inputs
        gray: "bg-slate-700/60 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 rounded-lg",
      },
      withRightIcon: { on: "pr-10", off: "" },
      withIcon: { on: "pl-10", off: "" },
    },
  },
};

// Custom theme for Alert
export const customAlertTheme = {
  root: {
    base: "flex flex-col gap-2 p-4 text-sm rounded-lg", // Ensure rounded-lg
    color: {
      failure: "bg-red-700/30 border border-red-600/50 text-red-300",
      success: "bg-green-700/30 border border-green-600/50 text-green-300",
      info: "bg-sky-700/30 border border-sky-600/50 text-sky-300", // Default info styled for dark
    },
  },
  icon: "mr-3 inline h-5 w-5 flex-shrink-0", // Ensure icon styling is applied
};

// Helper text styling (Flowbite's HelperText component default is often fine, but explicit styling ensures consistency)
// TextInput's helperText prop will render Flowbite's HelperText component.
// We can style it globally via Flowbite provider or assume its dark theme default is okay (dark:text-gray-400 -> slate-400)
// For this example, we'll rely on its default dark theme styling which should be text-slate-400 or similar.