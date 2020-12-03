import * as React from 'react';
import '../App.css';
import {
    Hero,
    Title,
    Container,
    Message,
    Box,
    Textarea,
    Button,
    Card,
    Content,
    Icon,
    Delete,
    Dropdown,
    Field,
    Label,
    Control,
    Input,
    Select,
} from 'rbx';
import { FaEnvelope, FaCheck, FaUser } from 'react-icons/fa';

const Inquiry = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <Container breakpoint="desktop">
                <form name="report-issue" method="POST">
                    <input type="hidden" name="form-name" value="report-issue" />
                    <p style={{ display: 'none' }}>
                        <label>
                            Don’t fill this out if you're human: <input name="bot-field" />
                        </label>
                    </p>
                    <Field horizontal>
                        <Field.Label size="normal"></Field.Label>
                        <Field.Body>
                            <Title>Report an issue</Title>
                        </Field.Body>
                    </Field>
                    <Field horizontal>
                        <Field.Label size="normal">
                            <Label>From</Label>
                        </Field.Label>
                        <Field.Body>
                            <Field>
                                <Control expanded iconLeft>
                                    <Input type="text" placeholder="Name" name="name" />
                                    <Icon size="small" align="left">
                                        <FaUser />
                                    </Icon>
                                </Control>
                            </Field>
                            <Field>
                                <Control expanded iconLeft>
                                    {/* iconRight */}
                                    {/* color="success" */}
                                    <Input placeholder="Email" type="email" name="email" />
                                    <Icon size="small" align="left">
                                        <FaEnvelope />
                                    </Icon>
                                    {/* <Icon size="small" align="right">
                                <FaCheck />
                            </Icon> */}
                                </Control>
                            </Field>
                        </Field.Body>
                    </Field>
                    <Field horizontal>
                        <Field.Label size="normal">
                            <Label>Type</Label>
                        </Field.Label>
                        <Field.Body>
                            <Field>
                                <Control>
                                    <Select.Container name="category[]">
                                        {/* color="danger */}
                                        <Select multiple size={3}>
                                            <Select.Option value="bug">Bug Report</Select.Option>
                                            <Select.Option value="Suggestion">Suggestion</Select.Option>
                                            <Select.Option value="miscellaneous">Miscellaneous</Select.Option>
                                        </Select>
                                    </Select.Container>
                                </Control>
                            </Field>
                        </Field.Body>
                    </Field>
                    <Field horizontal>
                        <Field.Label size="normal">
                            <Label>Description</Label>
                        </Field.Label>
                        <Field.Body>
                            <Field>
                                <Textarea placeholder="please describe the issue" name="message" />
                            </Field>
                        </Field.Body>
                    </Field>
                    <Field horizontal>
                        <Field.Label size="normal"></Field.Label>
                        <Field.Body>
                            <Button color="primary" type="submit">
                                Submit
                            </Button>
                        </Field.Body>
                    </Field>

                    {/* <p>
                    <label>Name: <input type="text" name="name" /></label>   
                </p>
                <p>
                    <label>Email: <input type="email" name="email" /></label>
                </p>
                <p>
                    <label>Category: <select name="category[]" multiple>
                    <option value="bug">Bug Report</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="miscellaneous">Miscellaneous</option>
                    </select></label>
                </p>
                <p>
                    <label>Description: <textarea name="message"></textarea></label>
                </p>
                <p>
                    <button type="submit">Send</button>
                </p> */}
                </form>
            </Container>
        </div>
    );
};

export default Inquiry;
