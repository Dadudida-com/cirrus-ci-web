import * as React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { navigateHelper } from 'utils/navigateHelper';

import { AccountSwitch_viewer$key } from './__generated__/AccountSwitch_viewer.graphql';

interface AccountSwitchProps {
  viewer?: AccountSwitch_viewer$key;
}

export default function AccountSwitch(props: AccountSwitchProps) {
  let viewer = useFragment(
    graphql`
      fragment AccountSwitch_viewer on User {
        relatedOwners {
          platform
          name
        }
      }
    `,
    props.viewer ?? null,
  );

  const navigate = useNavigate();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (e, name) => {
    setMenuAnchorEl(null);
    navigateHelper(navigate, e, '/github/' + name);
  };

  if (!viewer) return null;
  if (viewer.relatedOwners && viewer.relatedOwners.length <= 1) return null;

  return (
    <>
      <Button variant="contained" onClick={handleMenuOpen} endIcon={<ArrowDropDownIcon />}>
        Accounts
      </Button>
      <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
        {viewer.relatedOwners.map(viewer => {
          return (
            <MenuItem key={viewer.name} onClick={e => handleMenuItemClick(e, viewer.name)}>
              {viewer.name}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
