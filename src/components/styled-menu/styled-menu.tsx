import * as React from 'react';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import SettingsIcon from '@mui/icons-material/Settings';
import { MessagePayload } from '../../types';
import Utils from '../../utils/utils';
const StyledMenu = (props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
);

const CustomizedMenus: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSyncNew = async () => {    
    setAnchorEl(null);
    await Utils.sendRuntimeMessage({ type: "sync_new" })
  };

  const handleSyncAll = async () => {    
    setAnchorEl(null);
    await Utils.sendRuntimeMessage({ type: "sync_all" })

  };

  return (
    <div>
      <Button
        disableElevation
        onClick={handleClick}
      >
        <SettingsIcon />
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSyncNew} disableRipple>
          <SyncIcon />
          Sync new
        </MenuItem>
        <MenuItem onClick={handleSyncAll} disableRipple>
          <SyncIcon />
          Sync all
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
export default CustomizedMenus;