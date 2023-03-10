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



const ItemTable = () => {
    const headers = ['Item', 'Unit Price', 'Qty on Hand', 'Qty on Order'];
    const [items, setItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [showOrderAlert, setShowOrderAlert] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [item_name, setDescription] = useState();
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = useState('');
    const [price, setPrice] = useState();
    const [priceErr, setPriceErr] = useState(false);
    const [priceHelpertext, setPriceHelperText] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const isSmallScreen = useContext(WinWidthContext);



    const validateDescription = () => {
        if (!item_name) {
            setDescriptionErr(true);
            setDescriptionHelperText('Required field');
            return;
        } else if (!(item_name.length > 0) && !(item_name.length <= 50)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Must be 1-50 characters long');
            return;
        } else if (!(/^[a-zA-Z\s\d]*$/).test(item_name)) {
            setDescriptionErr(true);
            setDescriptionHelperText('Special characters are not allowed');
            return;
        } else {
            for (let item of items) {
                if (item.item_name === item_name) {
                    setDescriptionErr(true);
                    setDescriptionHelperText('Item already exists');
                    return;
                }
            }
        }
        setDescriptionErr(false);
        setDescriptionHelperText('');
        validatePrice();
    }

    const validatePrice = () => {
        if (!price) {
            setPriceErr(true);
            setPriceHelperText('Required field');
            return;
        }
        if (!(/^(\d+(\.\d{1,2})?)$/).test(price)) {
            setPriceErr(true);
            setPriceHelperText('Not a valid price format');
            return;
        }

        setPriceErr(false);
        setPriceHelperText('');
        addItem();
    }


    const getItems = async (item = '') => {
        try {
            let response;
            if (!item) {
                response = await fetch(`/items`);
            } else {
                response = await fetch(`/items/?item_name=${item}`);
            }
            const items = await response.json();
            setItems(items);
        } catch (error) {
            console.log(error.message);
        }
    }

    const addItem = async () => {
        try {
            const body = { item_name, price };
            await fetch('/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            setShowNewModal(false);
            getItems();
        } catch (error) {
            console.log(error.message);
        }
    }

    const changeCheckedItems = (id) => {
        // item got unchecked
        if (checkedItems.includes(id)) {
            const index = checkedItems.indexOf(id);
            // make a copy so that we aren't actually altering checkedItems until we setCheckedItems
            const checkedItemsCopy = checkedItems.slice();
            // remove the unchecked item id from array
            checkedItemsCopy.splice(index, 1);
            setCheckedItems(checkedItemsCopy);
            // add the itemId to the checked items list
        } else {
            setCheckedItems([...checkedItems, id]);
        }
    }

    const deleteItems = async () => {
        try {
            const body = { checkedItems };
            // reset the checked items array
            setCheckedItems([]);
            // close modal
            setShowDeleteModal(false);
            await fetch('/items', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            getItems();
        } catch (error) {
            console.log(error.message);
        }
    }

    const lookup = (item) => {
        setSearchValue(item);
        if (item) {
            getItems(item);
        } else {
            getItems();
        }
    }

    useEffect(() => {
        getItems();
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
                description=' You must select at least one item to delete!'
            />
            <Box display='flex' justifyContent='space-between' alignItems='center' flexDirection={isSmallScreen ? 'column' : 'row'}>
                <Box margin={1}>
                    <TextField
                        label="Search for an item"
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
                            label='New Item'
                            icon={<AddBoxIcon />}
                            click={() => setShowNewModal(true)}
                        />
                    </Box>
                    <Box marginRight={1}>
                        <CustomButton
                            label='New Order'
                            icon={<ShoppingCartIcon />}
                            click={() => checkedItems.length > 0 ? setShowOrderAlert(false) : setShowOrderAlert(true)}
                            type={Link}
                            link={checkedItems.length > 0 ?
                                {
                                    pathname: '/add-order',
                                    orderItemIds: checkedItems
                                }
                                : '#'}
                        />
                    </Box>
                    <Box marginRight={1}>
                        <CustomButton
                            label='Delete Items'
                            icon={<DeleteIcon />}
                            click={() => checkedItems.length > 0 ? (setShowDeleteAlert(false), setShowDeleteModal(true)) : setShowDeleteAlert(true)}
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
                                <b>Item Information</b>
                            </Typography>
                            <TextField
                                required
                                label="Item Name"
                                onChange={e => setDescription(e.target.value.trim())}
                                error={descriptionErr}
                                helperText={descriptionHelperText}
                            />
                            <TextField
                                required
                                label="Price"
                                onChange={e => setPrice(e.target.value)}
                                error={priceErr}
                                helperText={priceHelpertext}
                            />
                            {/*<TextField
                                required
                                label="Brand"
                                value={brand_name}
                                onChange={e => setBrands(e.target.value)}
                            />
                            <TextField
                                required
                                label="Category"
                                value={cat_name}
                                onChange={e => setCats(e.target.value)}
                            />*/}
                            {/*<FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={brand_name}
                                        label="Brand"
                                        onChange={e => setBrands(e.target.value)}
                                    >   
                                        {brand_name.map(brand=>(
                                            <MenuItem value={brand.brand_name}>{brand.brand_name}</MenuItem>
                                        ))}
                                    </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={cat_name}
                                        label="Category"
                                        onChange={e => setCats(e.target.value)}
                                    >
                                        {cat_name.map(cat=>(
                                            <MenuItem value={cat.cat_name}>{cat.cat_name}</MenuItem>
                                        ))}
                                    </Select>
                            </FormControl>*/}
                            <Box marginTop={2}>
                                <CustomButton
                                    label='Add Item'
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
                            <b>Delete Item Confirmation</b>
                        </Typography>
                        <Typography align='center' paragraph>
                            You are about to <b>delete</b> {checkedItems.length} items!
                            These items will also be removed from all orders.
                            This action cannot be undone.
                        </Typography>
                        <CustomButton
                            label='Confirm'
                            icon={<CheckCircleIcon />}
                            click={() => deleteItems()}
                        />
                    </>
                }
            />
            <CustomTable
                headers={headers}
                body=
                {items.map((item) => (
                    <TableRow hover key={item.item_id}>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                            <FormControlLabel
                                control=
                                {
                                    <Checkbox
                                        value={item.item_id}
                                        onChange={e => changeCheckedItems(e.target.value)}
                                    />
                                }
                            />
                            <Link to={{ pathname: `/item/${item.item_id}` }}>
                                {item.item_name}
                            </Link>
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.qty_on_hand}</TableCell>
                        <TableCell>{item.qty_on_order}</TableCell>
                    </TableRow>
                ))}
            />
        </>
    );
}

export default ItemTable;