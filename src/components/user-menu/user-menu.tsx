import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useLoginStore from '../login-modal/useLoginStore';
import { Avatar, Chip } from '@mui/material';

export default function AvatarMenu({ handleLoginOpen }: { handleLoginOpen: () => void }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const loginStore = useLoginStore();
    const { email } = loginStore;
    const emailPrefix = email.split("@")[0];
    const avatar = emailPrefix.split("")[0];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ marginLeft: '10px' }}>
            {email ?
                <Button onClick={handleClick}><Chip color="primary" avatar={<Avatar>{avatar}</Avatar>} label={emailPrefix} /></Button>
                :
                <Button variant="outlined">Login</Button>}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={loginStore.logout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
