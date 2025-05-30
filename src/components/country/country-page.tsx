import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
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
import {createCountry, deleteCountry, getCountries, updateCountry} from '../../services/country-service';
import type {Country} from "../../models/country.ts";
import PublicIcon from "@mui/icons-material/Public";

export default function CountryPage() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<Country>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async () => {
        const res = await getCountries();
        setCountries(res.data);
    };

    const handleOpen = (country?: Country) => {
        if (country) {
            setForm(country);
            setEditingId(country.id);
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
            await updateCountry(form);
        } else {
            await createCountry(form);
        }
        handleClose();
        fetchCountries();
    };

    const handleDelete = async (id: number) => {
        await deleteCountry(id);
        fetchCountries();
    };

    return (
        <div>
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
                    <PublicIcon/>
                    Countries
                </Typography>
                <Box display="flex" justifyContent="end" alignItems="end" mb={2}>

                    <Button variant="contained" startIcon={<Add/>} onClick={() => handleOpen()}>
                        Add Country
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countries.map((country) => (
                                <TableRow key={country.id}>
                                    <TableCell>{country.name}</TableCell>
                                    <TableCell>{country.code}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(country)}><Edit/></IconButton>
                                        <IconButton onClick={() => handleDelete(country.id)}><Delete/></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingId ? 'Edit Country' : 'Add Country'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            fullWidth
                            value={form.name || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="code"
                            label="Code"
                            fullWidth
                            value={form.code || ''}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}
