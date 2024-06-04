import { useEffect, useState } from "react";

type Props = {
  label?: string;
  inputValue?: string;
  onInputChange?: Function;
  buttonLabel?: string;
  onButtonClick: Function;
  buttonTitle?: string;
  inputStyles?: string;
  buttonStyles?: string;
  styles?: string;
}

export const TextFieldWithButton = ({ label, inputValue, onInputChange, buttonLabel, onButtonClick, buttonTitle, inputStyles, buttonStyles, styles }: Props) => {
  const [value, setValue] = useState(inputValue);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  const handleValueChange = (e: any) => {
    setValue(e.target.value);
    if(onInputChange) {
      onInputChange(e);
    }
  }

  const handleButtonClick = () => {
    onButtonClick(value);
  }

  return (
  <div className={styles}>
    <label htmlFor="test-name">{label}</label>
    <input
      type="text"
      id="test-name"
      value={value}
      onChange={handleValueChange}
      className={inputStyles}
    />
    <button
      className={buttonStyles}
      title={buttonTitle}
      onClick={handleButtonClick}
    >
      {buttonLabel}
    </button>
  </div>
);
}