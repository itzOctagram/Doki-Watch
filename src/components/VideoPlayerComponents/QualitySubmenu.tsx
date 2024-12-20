import { type ComponentType } from 'react';
import { Menu, useVideoQualityOptions } from '@vidstack/react';
// See "Icons" component page for setup before importing the following:
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SettingsMenuIcon,
} from '@vidstack/react/icons';

export const QualitySubmenu = () => {
    const options = useVideoQualityOptions(),
        currentQuality = options.selectedQuality?.height,
        hint =
            options.selectedValue !== 'auto' && currentQuality
                ? `${currentQuality}p`
                : `Auto${currentQuality ? ` (${currentQuality}p)` : ''}`;

    //to select highest quality by default
    // useEffect(() => {
    //     if (!options[1])
    //         return;
    //     options[1].select()
    // }, [options])

    return (
        <Menu.Root>
            <SubmenuButton
                label="Quality"
                hint={hint}
                disabled={options.disabled}
                icon={SettingsMenuIcon}
            />
            <Menu.Content className="vds-menu-items">
                <Menu.RadioGroup className="vds-radio-group" value={options.selectedValue}>
                    {options.map(({ label, value, bitrateText, select }) => (
                        <Menu.Radio className="vds-radio" value={value} onSelect={select} key={value}>
                            <CheckIcon className="vds-icon" />
                            <span className="vds-radio-label">{label}</span>
                            {bitrateText ? <span className="vds-radio-hint">{bitrateText}</span> : null}
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
            <Icon className="vds-icon" />
            <span className="vds-menu-item-label">{label}</span>
            <span className="vds-menu-item-hint">{hint}</span>
            <ChevronRightIcon className="vds-menu-open-icon" />
        </Menu.Button>
    );
}