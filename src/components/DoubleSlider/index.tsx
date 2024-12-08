import { useState, useEffect, useCallback } from "react";
import { Slider, Typography } from "@mui/material";
import { debounce } from "lodash";

export const DoubleSlider: React.FC<{
  ariaLabel: string;
  minValue: number;
  maxValue: number;
  label?: string;
  defaultValue?: number[] | number;
  setValue: (value: any) => void;
}> = ({ ariaLabel, minValue, maxValue, label, defaultValue, setValue }) => {
  const [sliderValue, setSliderValue] = useState<number[] | number>(
    defaultValue ?? [minValue, maxValue]
  );

  const debouncedSetValue = useCallback(
    debounce((newValue) => {
      setValue({
        type: "range",
        from: newValue[0],
        to: newValue[1],
      });
    }, 500),
    []
  );

  const handleChange = (event: Event, newValue: number[]) => {
    setSliderValue(newValue);
    debouncedSetValue(newValue);
  };

  useEffect(() => {
    return () => {
      debouncedSetValue.cancel();
    };
  }, []);

  return (
    <>
      {label && (
        <Typography
          component="label"
          fontSize={11}
          color="rgb(209 213 219)"
          sx={{ textTransform: "uppercase", mb: 2 }}
        >
          {label}
        </Typography>
      )}
      <Slider
        getAriaLabel={() => ariaLabel}
        value={sliderValue}
        onChange={handleChange}
        valueLabelDisplay="on"
        sx={{
          "& .MuiSlider-thumb": {
            backgroundColor: "#fff",
            width: 15,
            height: 15,
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "transparent",
            color: "rgb(209 213 219)",
            fontSize: 12,
            top: 0,
          },
        }}
        min={minValue}
        max={maxValue}
      />
    </>
  );
};
