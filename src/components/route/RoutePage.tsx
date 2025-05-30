import {
    Box,
    Button,
    Container,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';
import {JSX, useEffect, useState} from 'react';
import type {Location} from "../../models/location.ts";
import {getLocations} from "../../services/location-service.ts";
import {getRoutes} from "../../services/transportation-service.ts";
import {RouteModel} from "../../models/RouteModel.ts";
import {EnumTransportationType} from "../../models/enum-transportation-type.ts";

import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TrainIcon from '@mui/icons-material/Train';
import FlightIcon from '@mui/icons-material/Flight';
import RouteIcon from "@mui/icons-material/Route";

interface RouteQueryModel {
    fromLocationId: number;
    toLocationId: number;
    date: string;
}

const vehicleIcons: Record<EnumTransportationType, JSX.Element> = {
    BUS: <DirectionsBusIcon/>,
    UBER: <DirectionsCarIcon/>,
    SUBWAY: <TrainIcon/>,
    FLIGHT: <FlightIcon/>
};

export default function RoutePage() {
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState<Date | null>(Date());
    const [routes, setRoutes] = useState<RouteModel[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteModel | null>(null);
    const [form, setForm] = useState<Partial<RouteQueryModel>>({});
    const [locations, setLocations] = useState<Location[]>([]);
    const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        const res = await getLocations();
        setLocations(res.data);
    };

    const handleFromLocationChange = (e) => {
        setForm({...form, fromLocationId: Number(e.target.value)});
    };
    const handleToLocationChange = (e) => {
        setForm({...form, toLocationId: Number(e.target.value)})
    };
    const handleSearch = async () => {

        const response = await getRoutes(form);
        setRoutes(response.data);
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
                <RouteIcon/> Route Search
            </Typography>

            <Stack spacing={2} direction="row" mb={3} alignItems="center">
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
                <FormControl fullWidth margin="dense">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker fullWidth
                                    label="Date"
                                    value={form.date}
                                    onChange={(date) => setForm({...form, date: date})}
                        />
                    </LocalizationProvider>
                </FormControl>
                <Button fullWidth variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Stack>
            <Typography maxWidth={"max-content"} variant="h6" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2,
                mb: 2,
                borderBottom: '3px solid',
                pb: 1,
            }}>
                Available Routes
            </Typography>
            {routes?.map((route, index) => (
                <Box
                    key={index}
                    p={2}
                    mb={2}
                    sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        cursor: 'pointer',
                        maxWidth: 'sm'
                    }}
                    onClick={() => setSelectedRoute(route)}
                >
                    {route.secondDest != null && (<Typography>
                        {'via'} {route?.firstDest}
                    </Typography>)}
                    {route.secondDest === null && (<Typography>
                        {'directly'} {route?.firstDest}
                    </Typography>)}
                </Box>
            ))}

            <Drawer
                anchor="bottom"
                open={!!selectedRoute}
                onClose={() => setSelectedRoute(null)}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Box p={3} display={"block"} justifyContent={"center"}>
                    <Typography justifyContent={"center"} fontWeight="bold" maxWidth={"max-content"} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2,
                        mb: 2,
                        color: 'primary.main',
                        borderBottom: '1px solid',
                        pb: 1,
                    }} variant="h4" gutterBottom>
                        Route Detail
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" fontWeight="bold">{selectedRoute?.origin}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>────────</Typography>
                            {vehicleIcons[selectedRoute?.transportationType1]}
                            <Typography variant="body2">({selectedRoute?.transportationType1})</Typography>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>───────➤</Typography>
                        </Stack>
                        <Typography variant="h4" fontWeight="bold">{selectedRoute?.firstDest}</Typography>

                        {selectedRoute?.secondDest != null && (<Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>────────</Typography>
                            {vehicleIcons[selectedRoute?.transportationType2]}
                            <Typography variant="body2">({selectedRoute?.transportationType2})</Typography>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>───────➤</Typography>
                        </Stack>)}
                        {selectedRoute?.secondDest != null && (
                            <Typography variant="h4" fontWeight="bold">{selectedRoute?.secondDest}</Typography>)}

                        {selectedRoute?.lastDest != null && (<Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>────────</Typography>
                            {vehicleIcons[selectedRoute?.transportationType3]}
                            <Typography variant="body2">({selectedRoute?.transportationType3})</Typography>
                            <Typography sx={{fontSize: '1.5rem', mx: 1}}>───────➤</Typography>
                        </Stack>)}
                        {selectedRoute?.lastDest != null && (
                            <Typography variant="h4" fontWeight="bold">{selectedRoute?.lastDest}</Typography>)}

                    </Stack>
                </Box>
                {/*<Box p={3} width={300}>
                    <Typography variant="h6">Rota Detayı</Typography>
                    {selectedRoute && (
                        <>
                            <Typography> {selectedRoute.origin}</Typography>
                            <Typography> {selectedRoute.transportationType1}</Typography>
                            <Typography> {selectedRoute.firstDest}</Typography>
                            <Typography> {selectedRoute.transportationType2}</Typography>
                            <Typography> {selectedRoute.secondDest}</Typography>
                            <Typography> {selectedRoute.transportationType3}</Typography>
                            <Typography> {selectedRoute.lastDest}</Typography>
                        </>
                    )}
                </Box>*/}
            </Drawer>
        </Container>
    );
}
