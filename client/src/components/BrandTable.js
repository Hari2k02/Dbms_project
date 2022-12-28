import React, { useState, useEffect, useContext } from 'react';
import { WinWidthContext } from '../context/WinWidthContext';
import { Link } from 'react-router-dom';
import CustomAlert from './subcomponents/CustomAlert';
import CustomTable from './subcomponents/CustomTable';
import CustomModal from './subcomponents/CustomModal';
import CustomButton from './subcomponents/CustomButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
    TableCell,
    TableRow,
    FormControlLabel,
    Checkbox,
    TextField,
    Typography,
    InputAdornment,
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel
} from '@material-ui/core';

const BrandTable = () => {
    const headers = ['Brand', 'Status'];
    const [brands, setBrands] = useState([]);
    const [status,setStatus] = useState('');
    const [checkedBrands, setCheckedBrands] = useState([]);
    const [showOrderAlert, setShowOrderAlert] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brand_name, setDescription] = useState();
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const isSmallScreen = useContext(WinWidthContext);


    const validateDescription = () => {
        if (!brand_name) {
            setDescriptionErr(true);
            setDescriptionHelperText('Required field');
            return;
        } else if (!(brand_name.length > 0) && !(brand_name.length <= 50)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Must be 1-50 characters long');
            return;
        } else if (!(/^[a-zA-Z\s\d]*$/).test(brand_name)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Special characters are not allowed');
            return;
        } else {
            for (let brand of brands) {
                if (brand.brand_name === brand_name) {
                    setDescriptionErr(true);
                    setDescriptionHelperText('brand already exists');
                    return;
                }
            }
        }
        setDescriptionErr(false);
        setDescriptionHelperText('');
        addBrand();
        //validatePrice();
        
    }
    const getBrands = async (brand = '') => {
        try {
            let response;
            if (!brand) {
                response = await fetch(`/brands`);
            } else {
                response = await fetch(`/brands/?brand_name=${brand}`);
            }
            const brands = await response.json();
            setBrands(brands);
        } catch (error) {
            console.log(error.message);
        }
    }

    const addBrand = async () => {
        try {
            const body = { brand_name, status };
            await fetch('/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            setShowNewModal(false);
            getBrands();
        } catch (error) {
            console.log(error.message);
        }
    }

    const changeCheckedBrands = (id) => {
        // brand got unchecked
        if (checkedBrands.includes(id)) {
            const index = checkedBrands.indexOf(id);
            // make a copy so that we aren't actually altering checkedBrands until we setCheckedBrands
            const checkedBrandsCopy = checkedBrands.slice();
            // remove the unchecked brand id from array
            checkedBrandsCopy.splice(index, 1);
            setCheckedBrands(checkedBrandsCopy);
            // add the brandId to the checked brands list
        } else {
            setCheckedBrands([...checkedBrands, id]);
        }
    }

    const deleteBrands = async () => {
        try {
            const body = { checkedBrands };
            // reset the checked brands array
            setCheckedBrands([]);
            // close modal
            setShowDeleteModal(false);
            await fetch('/brands', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            getBrands();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lookup = (brand) => {
        setSearchValue(brand);
        if (brand) {
            getBrands(brand);
        } else {
            getBrands();
        }
    }

    useEffect(() => {
        getBrands();
    }, []);

    return (
        <>
            <CustomAlert
                open={showOrderAlert}
                close={() => setShowOrderAlert(false)}
                description=' You must select at least one item to create an order!'
            />
            <CustomAlert
                open={showDeleteAlert}
                close={() => setShowDeleteAlert(false)}
                description=' You must select at least one brand to delete!'
            />
            <Box display='flex' justifyContent='space-between' alignItems='center' flexDirection={isSmallScreen ? 'column' : 'row'}>
                <Box margin={1}>
                    <TextField
                        label="Search for a brand"
                        value={searchValue}
                        onChange={e => lookup(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box display='flex' margin={1}>
                    <Box marginRight={1}>
                        <CustomButton
                            label='New Brand'
                            icon={<AddBoxIcon />}
                            click={() => setShowNewModal(true)}
                        />
                    </Box>
                    <Box marginRight={1}>
                        <CustomButton
                            label='Delete Brands'
                            icon={<DeleteIcon />}
                            click={() => checkedBrands.length > 0 ? (setShowDeleteAlert(false), setShowDeleteModal(true)) : setShowDeleteAlert(true)}
                        />
                    </Box>
                </Box>
            </Box>
            <CustomModal
                open={showNewModal}
                close={() => setShowNewModal(false)}
                body={
                    <>
                        <Box paddingLeft={3} paddingRight={3} display='flex' flexDirection='column'>
                            <Typography variant='h5' align='center'>
                                <b>Brand Information</b>
                            </Typography>
                            <TextField
                                required
                                label="Brand Name"
                                onChange={e => setDescription(e.target.value.trim())}
                                error={descriptionErr}
                                helperText={descriptionHelperText}
                            />
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={status}
                                        label="Status"
                                        onChange={e => setStatus(e.target.value)}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Stopped">Stopped</MenuItem>
                                    </Select>
                            </FormControl>
                            <Box marginTop={2}>
                                <CustomButton
                                    label='Add Brand'
                                    icon={<CheckCircleIcon />}
                                    click={() => validateDescription()}
                                />
                            </Box>
                        </Box>
                    </>
                }
            />
            <CustomModal
                open={showDeleteModal}
                close={() => setShowDeleteModal(false)}
                body={
                    <>
                        <Typography variant='h5' align='center' gutterBottom>
                            <b>Delete Brand Confirmation</b>
                        </Typography>
                        <Typography align='center' paragraph>
                            You are about to <b>delete</b> {checkedBrands.length} brands!
                            These Brands will also be removed from all orders.
                            This action cannot be undone.
                        </Typography>
                        <CustomButton
                            label='Confirm'
                            icon={<CheckCircleIcon />}
                            click={() => deleteBrands()}
                        />
                    </>
                }
            />
            <CustomTable
                headers={headers}
                body=
                {brands.map((brand) => (
                    <TableRow hover key={brand.brand_id}>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                            <FormControlLabel
                                control=
                                {
                                    <Checkbox
                                        value={brand.brand_id}
                                        onChange={e => changeCheckedBrands(e.target.value)}
                                    />
                                }
                            />
                            <Link to={{ pathname: `/brand/${brand.brand_id}` }}>
                                {brand.brand_name}
                            </Link>
                        </TableCell>
                        <TableCell>{brand.status}</TableCell>
                    </TableRow>
                ))}
            />
        </>
    );
}

export default BrandTable;