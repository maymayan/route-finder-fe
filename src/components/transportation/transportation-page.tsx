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
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {
    createTransportation,
    deleteTransportation,
    getTransportations,
    updateTransportation
} from '../../services/transportation-service';
import type {Transportation} from "../../models/transportation.ts";
import CommuteIcon from "@mui/icons-material/Commute";
import type {Location} from "../../models/location.ts";
import {getLocations} from "../../services/location-service.ts";
import {EnumTransportationType} from "../../models/enum-transportation-type.ts";
import {DayOfWeekLabels, EnumDayOfWeek} from "../../models/enum-day-of-week.ts";

export default function TransportationPage() {
    const [transportations, setTransportations] = useState<Transportation[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<Transportation>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    const transportationTypeOptions = Object.keys(EnumTransportationType)
        .filter((key) => isNaN(Number(key)))
        .map((key) => ({
            label: key,
            value: EnumTransportationType[key as keyof typeof EnumTransportationType],
        }));

    const days = Object.keys(EnumDayOfWeek).filter(
        (v) => !isNaN(Number(v))
    ) as number[];

    useEffect(() => {
        fetchTransportations();
        fetchLocations();
    }, []);

    const fetchTransportations = async () => {
        const res = await getTransportations();
        setTransportations(res.data);
    };
    const fetchLocations = async () => {
        const res = await getLocations();
        setLocations(res.data);
    };

    const handleOpen = (transportation?: Transportation) => {
        if (transportation) {

            setForm(transportation);
            setSelectedDays(transportation.operatingDays);
            setEditingId(transportation.id);
        } else {
            setForm({});
            setEditingId(null);
        }
        setOpen(true);
    };

    /* const handleEdit = (transportationId: number) => {
         getTransportationById(transportationId).then(transportation => {
             setForm(transportation.data);
             setSelectedDays(transportation.data.operatingDays);
             setEditingId(transportation.data.id);
             setOpen(true);
         })

     }*/

    const handleClose = () => {
        setOpen(false);
        setForm({});
        setEditingId(null);
        setSelectedDays([]);
    };


    const handleSubmit = async () => {
        if (editingId) {
            await updateTransportation(form);
        } else {
            await createTransportation(form);
        }
        handleClose();
        fetchTransportations();
    };

    const handleDelete = async (id: number) => {
        await deleteTransportation(id);
        fetchTransportations();
    };

    const handleDaysSelected = (event) => {
        setSelectedDays(event.target.value);
        setForm({...form, operatingDays: event.target.value})
    };
    const handleFromLocationChange = (e) => {
        setForm({...form, fromLocationId: Number(e.target.value)});
    };
    const handleToLocationChange = (e) => {
        setForm({...form, toLocationId: Number(e.target.value)})
    };
    const handleTypeChange = (event) => {
        setForm({...form, transportationType: EnumTransportationType[(event.target.value)]})
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
                <CommuteIcon/>
                Transportations
            </Typography>
            <Box display="flex" justifyContent="end" alignItems="end" mb={2}>

                <Button variant="contained" startIcon={<Add/>} onClick={() => handleOpen()}>
                    Add Transportation
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Origin</TableCell>
                            <TableCell>Destination</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Operating Days</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transportations.map((transportation) => (
                            <TableRow key={transportation.id}>
                                <TableCell>{transportation.fromLocation.code}-{transportation.fromLocation.name}</TableCell>
                                <TableCell>{transportation.toLocation.code}-{transportation.toLocation.name}</TableCell>
                                <TableCell>{transportation.transportationType}</TableCell>
                                <TableCell>{transportation.operatingDays.map(it => DayOfWeekLabels[it]).toString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(transportation)}><Edit/></IconButton>
                                    <IconButton onClick={() => handleDelete(transportation.id)}><Delete/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingId ? 'Edit Transportation' : 'Add Transportation'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Origin</InputLabel>
                        <Select
                            name="fromLocationId"
                            value={form.fromLocationId || ''}
                            onChange={handleFromLocationChange}
                            label="Location"
                        >
                            {locations.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.code}-{location.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Destination</InputLabel>
                        <Select
                            name="toLocationId"
                            value={form.toLocationId || ''}
                            onChange={handleToLocationChange}
                            label="Destination"
                        >
                            {locations.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.code}-{location.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="transportation-type-label">Transportation Type</InputLabel>
                        <Select
                            labelId="transportation-type-label"
                            id="transportation-type"
                            value={EnumTransportationType[form.transportationType]}
                            label="Transportation Type"
                            onChange={handleTypeChange}
                        >
                            {transportationTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="operating-days-label">Operating Days</InputLabel>
                        <Select
                            labelId="day-select-label"
                            multiple
                            value={selectedDays}
                            onChange={handleDaysSelected}
                            input={<OutlinedInput label="Days of Week"/>}
                            renderValue={(selected) =>
                                selected
                                    ?.map((val) => DayOfWeekLabels[val])
                                    .join(', ')
                            }
                        >
                            {days.map((dayValue) => (
                                <MenuItem key={Number(dayValue)} value={Number(dayValue)}>
                                    <Checkbox checked={selectedDays.includes(Number(dayValue))}/>
                                    <ListItemText primary={DayOfWeekLabels[dayValue]}/>
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
