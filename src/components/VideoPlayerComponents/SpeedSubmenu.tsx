import { type ComponentType } from 'react';

import { Menu, usePlaybackRateOptions } from '@vidstack/react';
// See "Icons" component page for setup before importing the following:
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, OdometerIcon } from '@vidstack/react/icons';

export const SpeedSubmenu = ()=> {
  const options = usePlaybackRateOptions(),
    hint = options.selectedValue === '1' ? 'Normal' : options.selectedValue + 'x';
  return (
    <Menu.Root>
      <SubmenuButton label="Speed" hint={hint} disabled={options.disabled} icon={OdometerIcon} />
      <Menu.Content className="vds-menu-items">
        <Menu.RadioGroup className="vds-radio-group h-48" value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Menu.Radio className="vds-radio" value={value} onSelect={select} key={value}>
              <CheckIcon className="vds-icon" />
              <span className="vds-radio-label">{label}</span>
            </Menu.Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: ComponentType<React.SVGProps<any>>; // Ensures className can be passed
}

function SubmenuButton({ label, hint, icon: Icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button className="vds-menu-item" disabled={disabled}>
      <ChevronLeftIcon className="vds-menu-close-icon" />
      <Icon className="vds-icons"/>
      <span className="vds-menu-item-icon">{label}</span>
      <span className="vds-menu-item-hint">{hint}</span>
      <ChevronRightIcon className="vds-menu-open-icon" />
    </Menu.Button>
  );
}