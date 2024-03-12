import { Fragment, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Dropdown: React.FC<{
  placeholder: string;
  options: string[];
  value?: string;
  setValue?: (value: string) => void;
}> = ({ placeholder, options, value, setValue }) => {
  const firstItemRef = useRef(null);

  useEffect(() => {
    if (firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left w-full z-30">
      <div>
        <Menu.Button className="inline-flex w-full justify-between items-center rounded bg-gray-700/50 px-3 py-2 text-[0.8rem] font-light uppercase text-gray-100 z-30">
          {value || placeholder}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-1 w-[inherit] origin-top-right rounded bg-gray-700 shadow-lg overflow-y-auto max-h-40">
          <div className="py-1">
            {options.map((option, index) => {
              return (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      ref={firstItemRef}
                      key={index}
                      className={classNames(
                        active ? "bg-[#5937ef] text-gray-100" : "text-gray-100",
                        "block px-4 py-2 text-xs w-full text-left uppercase"
                      )}
                      onClick={() => setValue(option)}
                    >
                      {option}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
