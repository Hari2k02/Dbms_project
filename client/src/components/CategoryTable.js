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

const CategoryTable = () => {
    const headers = ['Category', 'Status'];
    const [cats, setCats] = useState([]);
    const [status,setStatus] = useState('');
    const [checkedCats, setCheckedCats] = useState([]);
    const [showOrderAlert, setShowOrderAlert] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cat_name, setDescription] = useState();
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const isSmallScreen = useContext(WinWidthContext);


    const validateDescription = () => {
        if (!cat_name) {
            setDescriptionErr(true);
            setDescriptionHelperText('Required field');
            return;
        } else if (!(cat_name.length > 0) && !(cat_name.length <= 50)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Must be 1-50 characters long');
            return;
        } else if (!(/^[a-zA-Z\s\d]*$/).test(cat_name)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Special characters are not allowed');
            return;
        } else {
            for (let cat of cats) {
                if (cat.cat_name === cat_name) {
                    setDescriptionErr(true);
                    setDescriptionHelperText('category already exists');
                    return;
                }
            }
        }
        setDescriptionErr(false);
        setDescriptionHelperText('');
        addCat();
        //validatePrice();
        
    }
    const getCats = async (cat = '') => {
        try {
            let response;
            if (!cat) {
                response = await fetch(`/categories`);
            } else {
                response = await fetch(`/categories/?cat_name=${cat}`);
            }
            const cats = await response.json();
            setCats(cats);
        } catch (error) {
            console.log(error.message);
        }
    }

    const addCat = async () => {
        try {
            const body = { cat_name, status };
            await fetch('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            setShowNewModal(false);
            getCats();
        } catch (error) {
            console.log(error.message);
        }
    }

    const changeCheckedCats = (id) => {
        // cat got unchecked
        if (checkedCats.includes(id)) {
            const index = checkedCats.indexOf(id);
            // make a copy so that we aren't actually altering checkedCats until we setCheckedCats
            const checkedCatsCopy = checkedCats.slice();
            // remove the unchecked cat id from array
            checkedCatsCopy.splice(index, 1);
            setCheckedCats(checkedCatsCopy);
            // add the catId to the checked cats list
        } else {
            setCheckedCats([...checkedCats, id]);
        }
    }

    const deleteCats = async () => {
        try {
            const body = { checkedCats };
            // reset the checked cats array
            setCheckedCats([]);
            // close modal
            setShowDeleteModal(false);
            await fetch('/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            getCats();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lookup = (cat) => {
        setSearchValue(cat);
        if (cat) {
            getCats(cat);
        } else {
            getCats();
        }
    }

    useEffect(() => {
        getCats();
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
                description=' You must select at least one category to delete!'
            />
            <Box display='flex' justifyContent='space-between' alignItems='center' flexDirection={isSmallScreen ? 'column' : 'row'}>
                <Box margin={1}>
                    <TextField
                        label="Search for a category"
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
                            label='New category'
                            icon={<AddBoxIcon />}
                            click={() => setShowNewModal(true)}
                        />
                    </Box>
                    <Box marginRight={1}>
                        <CustomButton
                            label='Delete categories'
                            icon={<DeleteIcon />}
                            click={() => checkedCats.length > 0 ? (setShowDeleteAlert(false), setShowDeleteModal(true)) : setShowDeleteAlert(true)}
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
                                <b>category Information</b>
                            </Typography>
                            <TextField
                                required
                                label="category Name"
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
                                    label='Add category'
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
                            <b>Delete category Confirmation</b>
                        </Typography>
                        <Typography align='center' paragraph>
                            You are about to <b>delete</b> {checkedCats.length} cats!
                            These categoriess will also be removed from all orders.
                            This action cannot be undone.
                        </Typography>
                        <CustomButton
                            label='Confirm'
                            icon={<CheckCircleIcon />}
                            click={() => deleteCats()}
                        />
                    </>
                }
            />
            <CustomTable
                headers={headers}
                body=
                {cats.map((cat) => (
                    <TableRow hover key={cat.cat_id}>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                            <FormControlLabel
                                control=
                                {
                                    <Checkbox
                                        value={cat.cat_id}
                                        onChange={e => changeCheckedCats(e.target.value)}
                                    />
                                }
                            />
                            <Link to={{ pathname: `/categories/${cat.cat_id}` }}>
                                {cat.cat_name}
                            </Link>
                        </TableCell>
                        <TableCell>{cat.status}</TableCell>
                    </TableRow>
                ))}
            />
        </>
    );
}

export default CategoryTable;