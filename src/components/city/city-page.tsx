import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
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
    TableSortLabel,
    TextField,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {createCity, deleteCity, getCities, updateCity} from '../../services/city-service';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import type {City} from "../../models/city.ts";
import {getCountries} from "../../services/country-service.ts";
import type {Country} from "../../models/country.ts";

export default function CityPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<City>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCities();
        fetchCountries();
    }, []);
    const fetchCountries = async () => {
        const res = await getCountries();
        setCountries(res.data);
    };
    const fetchCities = async () => {
        const res = await getCities();
        setCities(res.data);
    };

    const handleOpen = (city?: City) => {
        if (city) {
            setForm(city);
            setEditingId(city.id);
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
    };

    const handleSubmit = async () => {
        if (editingId) {
            await updateCity(form);
        } else {
            await createCity(form);
        }
        handleClose();
        fetchCities();
    };

    const handleDelete = async (id: number) => {
        await deleteCity(id);
        fetchCities();
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
                <LocationCityIcon/>
                Cities
            </Typography>
            <Box display="flex" justifyContent="end" alignItems="end" mb={2}>

                <Button variant="contained" startIcon={<Add/>} onClick={() => handleOpen()}>
                    Add City
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell><TableSortLabel>Country</TableSortLabel></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cities.map((city) => (
                            <TableRow key={city.id}>
                                <TableCell>{city.name}</TableCell>
                                <TableCell>{city.code}</TableCell>
                                <TableCell>{city.country.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(city)}><Edit/></IconButton>
                                    <IconButton onClick={() => handleDelete(city.id)}><Delete/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingId ? 'Edit City' : 'Add City'}</DialogTitle>
                <DialogContent>

                    <TextField
                        margin="dense"
                        name="code"
                        label="Code"
                        fullWidth
                        value={form.code || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={form.name || ''}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Country</InputLabel>
                        <Select
                            name="countryId"
                            value={form.countryId || ''}
                            onChange={(e) => setForm({...form, countryId: Number(e.target.value)})}
                            label="Country"
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.code}-{country.name}
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
