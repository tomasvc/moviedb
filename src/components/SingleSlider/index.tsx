import { useState, useEffect, useCallback } from "react";
import { Slider, Typography } from "@mui/material";
import { debounce } from "lodash";

export const SingleSlider: React.FC<{
  ariaLabel: string;
  label?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: number;
  setValue: (value: any) => void;
}> = ({ ariaLabel, label, minValue, maxValue, defaultValue, setValue }) => {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const debouncedSetValue = useCallback(
    debounce((newValue) => {
      setValue({
        type: "exact",
        releaseYear: newValue,
      });
    }, 500),
    []
  );

  const handleChange = (event: Event, newValue: number) => {
    setSliderValue(newValue);
    debouncedSetValue(newValue);
  };

  useEffect(() => {
    return () => {
      debouncedSetValue.cancel();
    };
  }, []);

  return (
    <div>
      {label && (
        <Typography
          component="label"
          fontSize={11}
          color="rgb(209 213 219)"
          sx={{ textTransform: "uppercase" }}
        >
          {label}
        </Typography>
      )}

      <Slider
        getAriaLabel={() => ariaLabel}
        value={sliderValue}
        defaultValue={1970}
        onChange={handleChange}
        min={minValue}
        max={maxValue}
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
        style={{ padding: "10px 0" }}
      />
    </div>
  );
};
