import {
    Box,
    Button,
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {createLocation, deleteLocation, getLocations, updateLocation} from '../../services/location-service';
import type {Location} from "../../models/location.ts";
import PlaceIcon from "@mui/icons-material/Place";
import type {Country} from "../../models/country.ts";
import type {City} from "../../models/city.ts";
import {getCountries} from "../../services/country-service.ts";
import {getCities} from "../../services/city-service.ts";

export default function LocationPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<Location>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchLocations();
        fetchCountries();
        fetchCities();
    }, []);
    const fetchCountries = async () => {
        const res = await getCountries();
        setCountries(res.data);
    };
    const fetchCities = async () => {
        const res = await getCities();
        setCities(res.data);
    };
    const fetchLocations = async () => {
        const res = await getLocations();
        setLocations(res.data);
    };

    const handleOpen = (location?: Location) => {
        if (location) {
            setForm(location);
            setEditingId(location.id);
        } else {
            setForm({});
            setEditingId(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({});
        setEditingId(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
        if (e.target.name == 'countryId' && e.target.value != null) {
            fetchCities();
        }
    };

    const handleSubmit = async () => {
        if (editingId) {
            await updateLocation(editingId, form);
        } else {
            await createLocation(form);
        }
        handleClose();
        fetchLocations();
    };

    const handleDelete = async (id: number) => {
        await deleteLocation(id);
        fetchLocations();
    };

    return (
        <Container maxWidth={false}>
            <Typography fontWeight="bold" maxWidth={"max-content"} variant="h4" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                mb: 2,
                color: 'primary.main',
                pb: 1,
            }}>
                <PlaceIcon/>
                Locations
            </Typography>
            <Box display="flex" justifyContent="end" alignItems="end" mb={2}>

                <Button variant="contained" startIcon={<Add/>} onClick={() => handleOpen()}>
                    Add Location
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>{location.code}</TableCell>
                                <TableCell>{location.country.name}</TableCell>
                                <TableCell>{location.city.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(location)}><Edit/></IconButton>
                                    <IconButton onClick={() => handleDelete(location.id)}><Delete/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingId ? 'Edit Location' : 'Add Location'}</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.airport}
                                onChange={(e) => setForm({...form, airport: e.target.checked})}
                                label="Airport"
                            />}
                        label="Airport"
                    />

                    <TextField
                        required={true}
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={form.name || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        required={true}
                        margin="dense"
                        aria-invalid={form.isAirport && form.code?.length != 3}
                        name="code"
                        label="Code"
                        fullWidth
                        value={form.code || ''}
                        onChange={handleChange}
                        inputProps={form.isAirport ? {maxLength: 3, minLength: 3} : {}}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Country</InputLabel>
                        <Select
                            required={true}
                            name="countryId"
                            value={form.countryId || ''}
                            onChange={handleChange}
                            label="Country"
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.code}-{country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>City</InputLabel>
                        <Select
                            required={true}
                            name="cityId"
                            value={form.cityId || ''}
                            onChange={handleChange}
                            label="City"
                        >
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.code}-{city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
