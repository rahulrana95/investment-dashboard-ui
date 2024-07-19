import React from 'react';
import { MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Box, Checkbox, ListItemText, OutlinedInput, Chip } from '@mui/material';
import useCategoryStore from './useCategoryStore';

const CategoryComponentHeader: React.FC = () => {
    const {
        selectedCategory,
        selectedDifficulty,
        selectedCompanyTags,
        categories,
        difficulties,
        companyTags,
        setSelectedCategory,
        setSelectedDifficulty,
        setSelectedCompanyTags,
    } = useCategoryStore();

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        setSelectedCategory(event.target.value);
    };

    const handleDifficultyChange = (event: SelectChangeEvent<string>) => {
        setSelectedDifficulty(event.target.value);
    };

    const handleCompanyTagsChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setSelectedCompanyTags(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            {/* Category Selector */}
            <FormControl variant="outlined" sx={{ minWidth: 200, m: 1, }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    label="Category"
                    size="small"
                >
                    {categories.map((category) => (
                        <MenuItem key={category.value} value={category.value}>
                            {category.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Difficulty Selector */}
            <FormControl variant="outlined" sx={{ minWidth: 200, m: 1, }} size="small">
                <InputLabel>Difficulty</InputLabel>
                <Select
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    label="Difficulty"
                    size="small"
                >
                    {difficulties.map((difficulty) => (
                        <MenuItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Company Tags Selector */}
            <FormControl variant="outlined" sx={{ minWidth: 200, m: 1, }} size="small">
                <InputLabel>Company Tags</InputLabel>
                <Select
                    size="small"
                    multiple
                    value={selectedCompanyTags}
                    onChange={handleCompanyTagsChange}
                    input={<OutlinedInput label="Company Tags" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {companyTags.map((tag) => (
                        <MenuItem key={tag.value} value={tag.value}>
                            <Checkbox checked={selectedCompanyTags.indexOf(tag.value) > -1} />
                            <ListItemText primary={tag.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CategoryComponentHeader;
